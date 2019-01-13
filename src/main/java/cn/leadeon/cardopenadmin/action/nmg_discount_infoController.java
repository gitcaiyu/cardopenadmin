package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_discount_info;
import cn.leadeon.cardopenadmin.service.nmg_discount_infoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin
/**
 * 优惠管理
 */
public class nmg_discount_infoController {

    @Autowired
    private nmg_discount_infoService nmg_discount_infoService;

    /**
     * 统一使用
     * @param nmg_discount_info
     * @param
     * @return
     */
    @PostMapping(value = "/discountUnify")
    public CardResponse discountUnify(@RequestBody nmg_discount_info nmg_discount_info,HttpServletRequest httpServletRequest) {
        return nmg_discount_infoService.discountUnify(nmg_discount_info,httpServletRequest);
    }

    /**
     * 盟市个性化页面展示
     * @param httpServletRequest
     * @return
     */
    @PostMapping(value = "/discountIndividualization")
    public CardResponse mealIndividualization(HttpServletRequest httpServletRequest, @RequestBody nmg_discount_info nmg_discount_info) {
        return nmg_discount_infoService.mealIndividualization(httpServletRequest,nmg_discount_info);
    }

    /**
     * 统一适配和盟市个性化新增方法
     * @param nmg_discount_info
     * @return
     */
    @PostMapping(value = "/discountAdd")
    public CardResponse mealAdd(@RequestBody nmg_discount_info nmg_discount_info) {
        return nmg_discount_infoService.mealAdd(nmg_discount_info);
    }

    /**
     * 套餐资费删除
     * @param data
     * @return
     */
    @PostMapping(value = "/cardDiscountDel")
    public CardResponse cardMealDel(@RequestBody String data) {
        return nmg_discount_infoService.cardMealDel(data);
    }

    /**
     * 上下线
     * @param data
     * @return
     */
    @PostMapping(value = "/discountOnOffLine")
    public CardResponse onoffLine(@RequestBody String data) { return nmg_discount_infoService.onoffLine(data); }

}
