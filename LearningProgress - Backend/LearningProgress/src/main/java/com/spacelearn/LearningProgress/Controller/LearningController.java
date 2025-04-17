package com.spacelearn.LearningProgress.Controller;

import com.spacelearn.LearningProgress.Entity.Learning;
import com.spacelearn.LearningProgress.Service.LearningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping ("/api/v1/learning")
public class LearningController {

        @Autowired
        private LearningService learningService;

    @PostMapping(value = "/save")
    private String savelearning(@RequestBody Learning learnings)
    {
        learningService.saveorUpdate(learnings);
        return learnings.getId();
    }
    @GetMapping(value = "/getAll")
    public Iterable<Learning>getLearnings()
    {
        return learningService.listAll();
    }
    @PutMapping(value = "/edit/{id}")
    private Learning update(@RequestBody Learning learning,@PathVariable(name = "id")String id){
        learning.setId(id);
        learningService.saveorUpdate(learning);
        return learning;
    }
    @DeleteMapping("/delete/{id}")
    private void deleteLearning(@PathVariable("id") String id) {
        learningService.deleteLearning(id);
    }
    @RequestMapping("/learning/{id}")
    private Learning getLearning(@PathVariable(name = "id") String learningid)
    {
        return learningService.getLearningById(learningid);
    }
}
