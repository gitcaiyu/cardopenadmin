package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_meal_info;
import cn.leadeon.cardopenadmin.service.nmg_meal_infoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RestController
@CrossOrigin
/**
 * 套餐资费
 */
public class nmg_meal_infoController {

    @Autowired
    private nmg_meal_infoService nmg_meal_infoService;

    /**
     * 统一适配页面展示
     * @return
     */
    @PostMapping(value = "/mealUnify")
    public CardResponse mealUnify(@RequestBody nmg_meal_info nmg_meal_info) {
        return nmg_meal_infoService.mealUnify(nmg_meal_info);
    }

    /**
     * 盟市个性化页面展示
     * @param httpSession
     * @return
     */
    @PostMapping(value = "/mealIndividualization")
    public CardResponse mealIndividualization(HttpSession httpSession,@RequestBody nmg_meal_info nmg_meal_info) {
        return nmg_meal_infoService.mealIndividualization(httpSession,nmg_meal_info);
    }

    /**
     * 统一适配和盟市个性化新增方法
     * @param nmg_meal_info
     * @return
     */
    @PostMapping(value = "/mealAdd")
    public CardResponse mealAdd(@RequestBody nmg_meal_info nmg_meal_info) {
        return nmg_meal_infoService.mealAdd(nmg_meal_info);
    }

    /**
     * 套餐资费删除
     * @param nmg_meal_info
     * @return
     */
    @PostMapping(value = "/cardMealDel")
    public CardResponse cardMealDel(@RequestBody nmg_meal_info nmg_meal_info) {
        return nmg_meal_infoService.cardMealDel(nmg_meal_info);
    }

    /**
     * 套餐资费更新包括上线下更新公用此方法
     * @param nmg_meal_info
     * @return
     */
    @PostMapping(value = "/cardMealUpdate")
    public CardResponse cardMealUpdate(@RequestBody nmg_meal_info nmg_meal_info) {
        return nmg_meal_infoService.cardMealUpdate(nmg_meal_info);
    }

}
