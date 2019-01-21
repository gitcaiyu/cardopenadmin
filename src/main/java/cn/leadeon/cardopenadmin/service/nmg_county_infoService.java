package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.mapper.nmg_county_infoMapper;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class nmg_county_infoService {

    @Autowired
    private nmg_county_infoMapper nmg_county_infoMapper;

    public CardResponse countyInfo(String data) {
        CardResponse cardResponse = new CardResponse();
        Object jsonObject = JSON.parse(data);
        JSONObject array = (JSONObject) jsonObject;
        Map result = new HashMap();
        Map param = new HashMap();
        param.put("city",array.get("city"));
        result.put("county",nmg_county_infoMapper.countyInfo(param));
        cardResponse.setResBody(result);
        return cardResponse;
    }

}
