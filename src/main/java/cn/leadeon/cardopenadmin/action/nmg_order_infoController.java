package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_order_detail;
import cn.leadeon.cardopenadmin.entity.nmg_order_info;
import cn.leadeon.cardopenadmin.service.nmg_order_infoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@RestController
@CrossOrigin
public class nmg_order_infoController {

    @Autowired
    private nmg_order_infoService nmg_order_infoService;

    /**
     * SIM卡回录页面初始化查询
     * @param nmg_order_info
     * @param httpServletRequest
     * @return
     */
    @PostMapping(value = "/simCard")
    public CardResponse simCard(@RequestBody nmg_order_info nmg_order_info, HttpServletRequest httpServletRequest) {
        return nmg_order_infoService.simCard(nmg_order_info,httpServletRequest);
    }

    /**
     * 订单信息导出
     * @param nmg_order_info
     * @param httpSession
     * @return
     */
    @PostMapping(value = "/orderExport")
    public CardResponse orderExport(@RequestBody nmg_order_info nmg_order_info,HttpSession httpSession) {
        return nmg_order_infoService.orderExport(nmg_order_info,httpSession);
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
     * 打印面单
     * @param nmg_order_info
     * @return
     */
    @PostMapping(value = "/orderPrint")
    public CardResponse orderPrint(@RequestBody nmg_order_info nmg_order_info) {
        return nmg_order_infoService.orderPrint(nmg_order_info);
    }

    /**
     * 页面点击修改或者处理页面展示详细信息
     * @param data
     * @return
     */
    @PostMapping(value = "/orderDetail")
    public CardResponse orderDetail(@RequestBody String data,HttpSession httpSession) {
        return nmg_order_infoService.orderDetail(data,httpSession);
    }

    /**
     * 订单信息导出
     * @param nmg_order_info
     * @return
     */
    @PostMapping(value = "/orderDetailExport")
    public CardResponse orderDetailExport(@RequestBody nmg_order_info nmg_order_info) {
        return nmg_order_infoService.orderDetailExport(nmg_order_info);
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
     * @param nmg_order_detail
     * @return
     */
    @PostMapping(value = "/orderDetailAdd")
    public CardResponse orderDetailAdd(@RequestBody nmg_order_detail nmg_order_detail){
        return nmg_order_infoService.orderDetailAdd(nmg_order_detail);
    }

    /**
     * 工单详细信息导出
     * @param file
     * @return
     * @throws IOException
     */
    @PostMapping(value = "/detailBatchImport")
    public CardResponse detailBatchImport(@RequestBody MultipartFile file) throws IOException {
        return nmg_order_infoService.detailBatchImport(file);
    }

}
