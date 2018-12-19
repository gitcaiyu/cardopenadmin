package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.mapper.nmg_menu_infoMapper;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class nmg_menu_infoService {

    @Autowired
    private nmg_menu_infoMapper nmg_menu_infoMapper;

    public CardResponse menuList(String role) {
        CardResponse cardResponse = new CardResponse();
        Map param = new HashMap();
        /**
         * 1：超级管理员
         * 2：盟市负责人
         * 3：社渠负责人
         * 4：写卡人员
         */
        param.put("role",role);
        List<Map<String, Object>> result = nmg_menu_infoMapper.menuList(param);
        List results = new ArrayList();
        for (int i = 0; i < result.size(); i++) {
            Map<String, Object> maps = result.get(i);
            JSONObject jsonObject = (JSONObject) JSON.toJSON(maps);
            String fatherId = jsonObject.getString("id");
            String fatherName = jsonObject.getString("menu_name");
            if (null != fatherId && !"".equals(fatherId)) {
                Map resultMaps = new HashMap();
                resultMaps.put("fatherId", fatherId);
                resultMaps.put("fatherName", fatherName);
                param.put("father_id", fatherId);
                resultMaps.put("child",nmg_menu_infoMapper.menuList(param));
                results.add(resultMaps);
            }
        }
        cardResponse.setResBody(results);
        return cardResponse;
    }

}
