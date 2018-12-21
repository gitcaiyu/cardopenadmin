package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_order_info;
import cn.leadeon.cardopenadmin.service.nmg_order_infoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
     * @param httpSession
     * @return
     */
    @PostMapping(value = "/simCard")
    public CardResponse simCard(@RequestBody nmg_order_info nmg_order_info, HttpSession httpSession) {
        return nmg_order_infoService.simCard(nmg_order_info,httpSession);
    }

    /**
     * 订单信息导出
     * @param httpSession
     * @return
     */
    @RequestMapping(value = "/orderExport",method = RequestMethod.POST)
    @CrossOrigin
    public CardResponse orderExport(HttpSession httpSession) {
        return nmg_order_infoService.orderExport(httpSession);
    }

}
