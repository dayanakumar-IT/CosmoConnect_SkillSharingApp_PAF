package com.example.cosmoconnect.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            String requestUri = request.getRequestURI();
            log.debug("Processing request to {} with method {}", requestUri, request.getMethod());

            // Skip authentication for public endpoints
            if (isPublicEndpoint(requestUri)) {
                log.debug("Skipping authentication for public endpoint: {}", requestUri);
                filterChain.doFilter(request, response);
                return;
            }

            if (StringUtils.hasText(jwt)) {
                log.debug("JWT token found in request");
                if (tokenProvider.validateToken(jwt)) {
                    log.debug("JWT token is valid");
                    Authentication authentication = tokenProvider.getAuthentication(jwt);
                    if (authentication != null && authentication.getPrincipal() != null) {
                        Object principal = authentication.getPrincipal();
                        log.debug("Setting authentication in SecurityContext. Principal type: {}", 
                                principal.getClass().getName());
                        
                        if (principal instanceof OAuth2User) {
                            OAuth2User oauth2User = (OAuth2User) principal;
                            String email = oauth2User.getAttribute("email");
                            log.debug("OAuth2User email from token: {}", email);
                        }
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        log.debug("Authentication set successfully");
                    } else {
                        log.warn("Authentication or principal is null for valid JWT token");
                        setUnauthorizedResponse(response, "Invalid authentication data");
                        return;
                    }
                } else {
                    log.warn("Invalid JWT token for request: {}", requestUri);
                    setUnauthorizedResponse(response, "Invalid token");
                    return;
                }
            } else {
                log.debug("No JWT token found in request to: {}", requestUri);
            }

            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException ex) {
            log.error("JWT token is expired: {}", ex.getMessage());
            setUnauthorizedResponse(response, "Token expired");
            return;
        } catch (SignatureException ex) {
            log.error("JWT signature validation failed: {}", ex.getMessage());
            setUnauthorizedResponse(response, "Invalid token signature");
            return;
        } catch (JwtException ex) {
            log.error("JWT token error: {}", ex.getMessage());
            setUnauthorizedResponse(response, "Invalid token");
            return;
        } catch (Exception ex) {
            log.error("Unexpected error in JWT authentication", ex);
            log.error("Error details: ", ex);
            response.sendError(HttpStatus.INTERNAL_SERVER_ERROR.value(), 
                "Unexpected authentication error: " + ex.getMessage());
            return;
        }
    }

    private boolean isPublicEndpoint(String requestUri) {
        return requestUri.startsWith("/api/auth/") || 
               requestUri.startsWith("/oauth2/") ||
               requestUri.startsWith("/login/oauth2/code/") ||
               requestUri.equals("/error");
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            log.debug("Extracted JWT token from Authorization header");
            return token;
        }
        log.debug("No Bearer token found in Authorization header");
        return null;
    }

    private void setUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String jsonResponse = String.format("{\"status\": %d, \"error\": \"Unauthorized\", \"message\": \"%s\"}",
                HttpStatus.UNAUTHORIZED.value(), message);
        response.getWriter().write(jsonResponse);
    }
}