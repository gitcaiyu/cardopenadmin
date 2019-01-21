package cn.leadeon.cardopenadmin.action;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.service.nmg_county_infoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class nmg_county_infoController {

    @Autowired
    private nmg_county_infoService nmg_county_infoService;

    @PostMapping(value = "/countyInfo")
    public CardResponse countyInfo(@RequestBody String data) {
        return nmg_county_infoService.countyInfo(data);
    }

}
