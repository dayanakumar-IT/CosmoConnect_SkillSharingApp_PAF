package com.example.cosmoconnect.Controller;

import com.example.cosmoconnect.Entity.LearningPlan;
import com.example.cosmoconnect.Service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/learningplan")

public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @PostMapping(value = "/save")
    public LearningPlan saveLearningPlan(@RequestBody LearningPlan learningPlan) {
        return learningPlanService.saveorUpdate(learningPlan);
    }

    @GetMapping(value = "/getAll")
    private Iterable<LearningPlan>getLearningPlan()
    {
        return learningPlanService.listAll();
    }

    @PutMapping(value = "/edit/{id}")
    private LearningPlan update(@RequestBody LearningPlan learningPlan,@PathVariable(name = "id")String _id)
    {
      learningPlan.set_id(_id);
      learningPlanService.saveorUpdate(learningPlan);
      return learningPlan;
    }

    @DeleteMapping("/delete/{id}")
            private void deleteLearningPlan(@PathVariable("id") String _id)
    {
        learningPlanService.deleteLearningPlan(_id);
    }

    @RequestMapping("/learningplan/{id}")
    private LearningPlan getLearningPlan(@PathVariable(name = "id")String learningPlanid)
    {
        return learningPlanService.getLearningPlanById(learningPlanid);
    }
}
