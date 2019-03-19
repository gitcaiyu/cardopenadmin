package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_order_detail;
import cn.leadeon.cardopenadmin.entity.nmg_order_info;
import cn.leadeon.cardopenadmin.service.nmg_order_infoService;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@RestController
@CrossOrigin
public class nmg_order_infoController {

    @Autowired
    private nmg_order_infoService nmg_order_infoService;

    /**
     * SIM卡回录页面初始化查询
     * @param httpServletRequest
     * @return
     */
    @RequestMapping(value = "/simCard")
    public JSONObject simCard(HttpServletRequest httpServletRequest) {
        nmg_order_info nmg_order_info = new nmg_order_info();
        nmg_order_info.setCurr(Integer.valueOf(httpServletRequest.getParameter("page")));
        nmg_order_info.setLimit(Integer.valueOf(httpServletRequest.getParameter("limit")));
        nmg_order_info.setCity(httpServletRequest.getParameter("city"));
        nmg_order_info.setCounty(httpServletRequest.getParameter("county"));
        nmg_order_info.setChannelName(httpServletRequest.getParameter("channelName"));
        nmg_order_info.setChannelType(httpServletRequest.getParameter("channelType"));
        nmg_order_info.setOrderMeal(httpServletRequest.getParameter("orderMeal"));
        nmg_order_info.setOrderDiscount(httpServletRequest.getParameter("orderDiscount"));
        nmg_order_info.setOrderState(httpServletRequest.getParameter("orderState"));
        nmg_order_info.setSubTime(httpServletRequest.getParameter("subTime"));
        nmg_order_info.setSubTimeE(httpServletRequest.getParameter("subTimeE"));
        nmg_order_info.setCreateTime(httpServletRequest.getParameter("createTime"));
        nmg_order_info.setCreateTimeE(httpServletRequest.getParameter("createTimeE"));
        nmg_order_info.setOrderOtherPeople(httpServletRequest.getParameter("orderOtherPeople"));
        nmg_order_info.setOrderOtherPhone(httpServletRequest.getParameter("orderOtherPhone"));
        return nmg_order_infoService.simCard(nmg_order_info,httpServletRequest);
    }

    /**
     * 订单信息导出
     * @param httpSession
     * @return
     */
    @GetMapping(value = "/orderExport")
    public void orderExport(HttpServletRequest httpServletRequest,HttpServletResponse httpServletResponse, HttpSession httpSession) {
        nmg_order_info nmg_order_info = new nmg_order_info();
        nmg_order_info.setCity(httpServletRequest.getParameter("city"));
        nmg_order_info.setCounty(httpServletRequest.getParameter("county"));
        nmg_order_info.setChannelName(httpServletRequest.getParameter("channelName"));
        nmg_order_info.setChannelType(httpServletRequest.getParameter("channelType"));
        nmg_order_info.setOrderMeal(httpServletRequest.getParameter("orderMeal"));
        nmg_order_info.setOrderDiscount(httpServletRequest.getParameter("orderDiscount"));
        nmg_order_info.setOrderState(httpServletRequest.getParameter("orderState"));
        nmg_order_info.setSubTime(httpServletRequest.getParameter("subTime"));
        nmg_order_info.setSubTimeE(httpServletRequest.getParameter("subTimeE"));
        nmg_order_info.setCreateTime(httpServletRequest.getParameter("createTime"));
        nmg_order_info.setCreateTimeE(httpServletRequest.getParameter("createTimeE"));
        nmg_order_info.setOrderOtherPeople(httpServletRequest.getParameter("orderOtherPeople"));
        nmg_order_info.setOrderOtherPhone(httpServletRequest.getParameter("orderOtherPhone"));
        nmg_order_infoService.orderExport(httpServletRequest,httpServletResponse,nmg_order_info,httpSession);
    }

    /**
     * 订单取消
     * @param nmg_order_info
     * @return
     */
    @PostMapping(value = "/orderDel")
    public CardResponse orderDel(@RequestBody nmg_order_info nmg_order_info) {
        return nmg_order_infoService.orderDel(nmg_order_info);
    }

    /**
     * 更新订单状态
     * @param data
     * @return
     */
    @PostMapping(value = "/updateState")
    public CardResponse updateState(@RequestBody String data) {
        return nmg_order_infoService.updateState(data);
    }

    /**
     * 页面点击修改或者处理页面展示详细信息
     * @param data
     * @param httpServletRequest
     * @return
     */
    @PostMapping(value = "/orderDetail")
    public CardResponse orderDetail(@RequestBody String data,HttpServletRequest httpServletRequest) {
        return nmg_order_infoService.orderDetail(data,httpServletRequest);
    }

    /**
     * 订单信息导出
     * @param httpServletRequest
     * @return
     */
    @GetMapping(value = "/orderDetailExport")
    public void orderDetailExport(HttpServletRequest httpServletRequest,HttpServletResponse httpServletResponse) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("cardnum",httpServletRequest.getParameter("cardnum"));
        jsonObject.put("simnum",httpServletRequest.getParameter("simnum"));
        jsonObject.put("orderMeal",httpServletRequest.getParameter("orderMeal"));
        jsonObject.put("orderDiscount",httpServletRequest.getParameter("orderDiscount"));
        jsonObject.put("orderId",httpServletRequest.getParameter("orderId"));
        nmg_order_infoService.orderDetailExport(httpServletRequest,httpServletResponse,jsonObject);
    }

    /**
     * 工单详细信息批量删除
     * @param data
     * @return
     */
    @PostMapping(value = "/orderDetailDel")
    public CardResponse orderDetailDel(@RequestBody String data) {
        return nmg_order_infoService.orderDetailDel(data);
    }

    /**
     * 新增一条订单详细信息
     * @param data
     * @return
     */
    @PostMapping(value = "/orderDetailAdd")
    public CardResponse orderDetailAdd(@RequestBody String data){
        return nmg_order_infoService.orderDetailAdd(data);
    }

    /**
     * 工单详细信息导入
     * @param file
     * @return
     * @throws IOException
     */
    @PostMapping(value = "/detailBatchImport")
    public CardResponse detailBatchImport(@RequestBody MultipartFile file) throws IOException {
        return nmg_order_infoService.detailBatchImport(file);
    }

    /**
     * SIM卡回录模板
     * @param httpServletRequest
     * @param httpServletResponse
     * @return
     */
    @RequestMapping(value = "/orderTemplate")
    public CardResponse orderTemplate(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        return nmg_order_infoService.orderTemplate(httpServletRequest,httpServletResponse);
    }

}
