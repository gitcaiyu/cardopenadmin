package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_order_info;
import cn.leadeon.cardopenadmin.service.nmg_order_infoService;
import cn.leadeon.cardopenadmin.service.nmg_statistical_queryService;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@RestController
@CrossOrigin
/**
 * 统计查询
 */
public class nmg_statistical_queryController {

    @Autowired
    private nmg_statistical_queryService nmg_statistical_queryService;

    @Autowired
    private nmg_order_infoService nmg_order_infoService;

    /**
     * 工单统计
     * @param httpServletRequest
     * @return
     */
    @RequestMapping(value = "/workCount")
    public JSONObject workCount(HttpServletRequest httpServletRequest) {
        nmg_order_info nmg_order_info = new nmg_order_info();
        nmg_order_info.setCurr(Integer.valueOf(httpServletRequest.getParameter("page")));
        nmg_order_info.setLimit(Integer.valueOf(httpServletRequest.getParameter("limit")));
        nmg_order_info.setCity(httpServletRequest.getParameter("city"));
        nmg_order_info.setCounty(httpServletRequest.getParameter("county"));
        nmg_order_info.setOrderMeal(httpServletRequest.getParameter("meal"));
        nmg_order_info.setOrderDiscount(httpServletRequest.getParameter("discount"));
        nmg_order_info.setOrderState(httpServletRequest.getParameter("state"));
        nmg_order_info.setSubTime(httpServletRequest.getParameter("subTime"));
        nmg_order_info.setSubTimeE(httpServletRequest.getParameter("subTimeE"));
        nmg_order_info.setCreateTime(httpServletRequest.getParameter("createTime"));
        nmg_order_info.setCreateTimeE(httpServletRequest.getParameter("createTimeE"));
        return nmg_order_infoService.workCount(nmg_order_info);
    }

    /**
     * 工单导出
     * @param httpServletRequest
     * @return
     */
    @GetMapping(value = "/workExport")
    public void workExport(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        nmg_order_info nmg_order_info = new nmg_order_info();
        nmg_order_info.setCity(httpServletRequest.getParameter("city"));
        nmg_order_info.setCounty(httpServletRequest.getParameter("county"));
        nmg_order_info.setOrderMeal(httpServletRequest.getParameter("meal"));
        nmg_order_info.setOrderDiscount(httpServletRequest.getParameter("discount"));
        nmg_order_info.setOrderState(httpServletRequest.getParameter("state"));
        nmg_order_info.setSubTime(httpServletRequest.getParameter("subTime"));
        nmg_order_info.setSubTimeE(httpServletRequest.getParameter("subTimeE"));
        nmg_order_info.setCreateTime(httpServletRequest.getParameter("createTime"));
        nmg_order_info.setCreateTimeE(httpServletRequest.getParameter("createTimeE"));
        nmg_statistical_queryService.workExport(nmg_order_info,httpServletRequest,httpServletResponse);
    }

    /**
     * SIM卡统计
     * @param data
     * @param httpServletRequest
     * @return
     */
    @PostMapping(value = "/simCount")
    public JSONObject simCount(@RequestBody String data,HttpServletRequest httpServletRequest) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("curr",httpServletRequest.getParameter("page"));
        jsonObject.put("limit",httpServletRequest.getParameter("limit"));
        jsonObject.put("orderMeal",httpServletRequest.getParameter("orderMeal"));
        jsonObject.put("orderDiscount",httpServletRequest.getParameter("orderDiscount"));
        jsonObject.put("orderState",httpServletRequest.getParameter("orderState"));
        jsonObject.put("cardnum",httpServletRequest.getParameter("cardnum"));
        jsonObject.put("simnum",httpServletRequest.getParameter("simnum"));
        jsonObject.put("subTime",httpServletRequest.getParameter("subTime"));
        jsonObject.put("subtimeE",httpServletRequest.getParameter("subTimeE"));
        jsonObject.put("createTime",httpServletRequest.getParameter("createTime"));
        jsonObject.put("createTimeE",httpServletRequest.getParameter("createTimeE"));
        return nmg_order_infoService.simCount(jsonObject.toJSONString());
    }

    /**
     * 工单明细导出
     * @param httpServletRequest
     * @return
     */
    @GetMapping(value = "/simExport")
    public void simExport(HttpServletRequest httpServletRequest,HttpServletResponse httpServletResponse) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("orderMeal",httpServletRequest.getParameter(""));
        jsonObject.put("orderDiscount",httpServletRequest.getParameter(""));
        jsonObject.put("orderState",httpServletRequest.getParameter(""));
        jsonObject.put("cardnum",httpServletRequest.getParameter(""));
        jsonObject.put("simnum",httpServletRequest.getParameter(""));
        jsonObject.put("subTime",httpServletRequest.getParameter(""));
        jsonObject.put("subTimeE",httpServletRequest.getParameter(""));
        jsonObject.put("createTime",httpServletRequest.getParameter(""));
        jsonObject.put("createTimeE",httpServletRequest.getParameter(""));
        nmg_statistical_queryService.simExport(jsonObject,httpServletRequest,httpServletResponse);
    }


}
