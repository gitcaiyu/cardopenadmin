package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_order_info;
import cn.leadeon.cardopenadmin.service.nmg_order_infoService;
import cn.leadeon.cardopenadmin.service.nmg_statistical_queryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

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
     * @param nmg_order_info
     * @param httpSession
     * @return
     */
    @PostMapping(value = "/workCount")
    public CardResponse workCount(@RequestBody nmg_order_info nmg_order_info, HttpSession httpSession) {
        return nmg_order_infoService.simCard(nmg_order_info,httpSession);
    }

    /**
     * 工单导出
     * @param httpSession
     * @return
     */
    @PostMapping(value = "/workExport")
    public CardResponse workExport(@RequestBody nmg_order_info nmg_order_info, HttpSession httpSession) {
        return nmg_statistical_queryService.workExport(nmg_order_info,httpSession);
    }

    /**
     * SIM卡统计
     * @param data
     * @param httpSession
     * @return
     */
    @PostMapping(value = "/simCount")
    public CardResponse simCount(@RequestBody String data,HttpSession httpSession) {
        return nmg_order_infoService.orderDetail(data,httpSession);
    }

    /**
     * 工单明细导出
     * @param data
     * @return
     */
    @PostMapping(value = "/simExport")
    public CardResponse simExport(@RequestBody String data) {
        return nmg_statistical_queryService.simExport(data);
    }


}
