package com.example.cosmoconnect.oauth2;

import com.example.cosmoconnect.config.JwtTokenProvider;
import com.example.cosmoconnect.exception.BadRequestException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;

    @Value("${oauth2.authorizedRedirectUris}")
    private List<String> authorizedRedirectUris;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        try {
            log.info("OAuth2 Authentication Successful");
            log.info("Authentication Principal: {}", authentication.getPrincipal());
            log.info("Authentication Authorities: {}", authentication.getAuthorities());
            log.info("Request URI: {}", request.getRequestURI());
            log.info("Request Parameters: {}", request.getParameterMap());

            if (authentication.getPrincipal() instanceof OAuth2User) {
                OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
                log.info("OAuth2 User Attributes: {}", oauth2User.getAttributes());
            }

            String targetUrl = determineTargetUrl(request, response, authentication);

            if (response.isCommitted()) {
                log.warn("Response already committed. Unable to redirect to: {}", targetUrl);
                return;
            }

            clearAuthenticationAttributes(request);
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } catch (Exception e) {
            log.error("OAuth2 Authentication Success Handler Error", e);
            log.error("Error details: {}", e.getMessage());
            log.error("Stack trace: ", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Authentication failed: " + e.getMessage() + 
                "\nPlease check server logs for more details.");
        }
    }

    protected String determineTargetUrl(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        try {
            String redirectUri = request.getParameter("redirect_uri");
            log.info("Redirect URI from request: {}", redirectUri);
            log.info("Authorized Redirect URIs: {}", authorizedRedirectUris);

            if (redirectUri == null) {
                if (authorizedRedirectUris.isEmpty()) {
                    throw new BadRequestException("No authorized redirect URIs configured");
                }
                redirectUri = authorizedRedirectUris.get(0);
                log.info("Using default redirect URI: {}", redirectUri);
            }

            if (!isAuthorizedRedirectUri(redirectUri)) {
                log.error("Unauthorized Redirect URI: {}", redirectUri);
                throw new BadRequestException("Unauthorized Redirect URI: " + redirectUri);
            }

            String token = generateAuthToken(authentication);
            log.info("Generated JWT token successfully");

            String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                    .queryParam("token", token)
                    .build().toUriString();

            log.info("Generated Target URL: {}", targetUrl);
            return targetUrl;
        } catch (Exception e) {
            log.error("Error in determineTargetUrl: {}", e.getMessage());
            throw e;
        }
    }

    protected String generateAuthToken(Authentication authentication) {
        try {
            return tokenProvider.generateToken(authentication);
        } catch (Exception e) {
            log.error("Token generation failed: {}", e.getMessage());
            log.error("Token generation stack trace: ", e);
            throw new RuntimeException("Failed to generate authentication token: " + e.getMessage(), e);
        }
    }

    private boolean isAuthorizedRedirectUri(String uri) {
        try {
            URI clientRedirectUri = URI.create(uri);
            return authorizedRedirectUris.stream()
                    .map(URI::create)
                    .anyMatch(authorizedUri ->
                            authorizedUri.getHost().equalsIgnoreCase(clientRedirectUri.getHost()) &&
                                    authorizedUri.getPort() == clientRedirectUri.getPort()
                    );
        } catch (Exception e) {
            log.error("Redirect URI validation error: {}", e.getMessage());
            log.error("URI that caused error: {}", uri);
            return false;
        }
    }
}