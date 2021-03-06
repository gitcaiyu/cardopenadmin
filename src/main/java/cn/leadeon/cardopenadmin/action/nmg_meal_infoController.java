package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_meal_info;
import cn.leadeon.cardopenadmin.service.nmg_meal_infoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

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
     * @param httpServletRequest
     * @return
     */
    @PostMapping(value = "/mealUnify")
    public CardResponse mealUnify(@RequestBody nmg_meal_info nmg_meal_info,HttpServletRequest httpServletRequest) {
        return nmg_meal_infoService.mealUnify(nmg_meal_info,httpServletRequest);
    }

    /**
     * 盟市个性化页面展示
     * @param httpServletRequest
     * @return
     */
    @PostMapping(value = "/mealIndividualization")
    public CardResponse mealIndividualization(HttpServletRequest httpServletRequest, @RequestBody nmg_meal_info nmg_meal_info) {
        return nmg_meal_infoService.mealIndividualization(httpServletRequest,nmg_meal_info);
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
     * @param data
     * @return
     */
    @PostMapping(value = "/cardMealDel")
    public CardResponse cardMealDel(@RequestBody String data) {
        return nmg_meal_infoService.cardMealDel(data);
    }

    /**
     * 上下线
     * @param data
     * @return
     */
    @PostMapping(value = "/mealOnOffLine")
    public CardResponse onoffLine(@RequestBody String data) { return nmg_meal_infoService.onoffLine(data); }

}
