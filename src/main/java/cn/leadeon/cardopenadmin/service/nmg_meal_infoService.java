package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.CodeEnum;
import cn.leadeon.cardopenadmin.common.RandomUtil;
import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_city_info;
import cn.leadeon.cardopenadmin.entity.nmg_meal_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.mapper.nmg_city_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_meal_infoMapper;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class nmg_meal_infoService {

    @Autowired
    private nmg_meal_infoMapper nmg_meal_infoMapper;

    @Autowired
    private nmg_city_infoMapper nmg_city_infoMapper;

    @Autowired
    private nmg_city_infoService nmg_city_infoService;

    public CardResponse mealUnify(nmg_meal_info nmg_meal_info,HttpServletRequest httpServletRequest) {
        CardResponse cardResponse = new CardResponse();
        try {
            Map param = new HashMap();
            Map results = new HashMap();
            HttpSession httpSession = httpServletRequest.getSession();
            nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
            if (null != nmg_meal_info.getMealId() && !"".equals(nmg_meal_info.getMealId())) {
                param.put("mealId",nmg_meal_info.getMealId());
                results.put("city",nmg_city_infoMapper.cityInfo(null));
            }
            if (nmg_user_info.getUserRole().equals("2")) {
                param.put("city",nmg_user_info.getCityCode());
                results.put("city",nmg_city_infoMapper.cityInfo(param));
            } else {
                List<nmg_city_info> city = nmg_city_infoService.city();
                results.put("city",city);
            }
            param.put("flag",'T');
            param.put("unify","A");
            results.put("meal",nmg_meal_infoMapper.applyCardMeal(param));
            cardResponse.setResBody(results);
        } catch (Exception e) {
            cardResponse.setResDesc(e.getMessage());
            cardResponse.setResCode(CodeEnum.failed.getCode());
        }
        return cardResponse;
    }

    public CardResponse mealIndividualization(HttpServletRequest httpServletRequest, nmg_meal_info nmg_meal_info) {
        CardResponse cardResponse = new CardResponse();
        try {
            HttpSession httpSession = httpServletRequest.getSession();
            nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
            Map param = new HashMap();
            Map results = new HashMap();
            if (nmg_user_info.getUserRole().equals("2")) {
                param.put("city",nmg_user_info.getCityCode());
                results.put("city",nmg_city_infoMapper.cityInfo(param));
            } else {
                List<nmg_city_info> city = nmg_city_infoService.city();
                results.put("city",city);
            }
            if (null != nmg_meal_info.getMealId() && !"".equals(nmg_meal_info.getMealId())) {
                param.put("mealId",nmg_meal_info.getMealId());
                results.put("city",nmg_city_infoMapper.cityInfo(param));
            }
            results.put("meal",nmg_meal_infoMapper.applyCardMeal(param));
            cardResponse.setResBody(results);
        } catch (Exception e) {
            cardResponse.setResDesc(e.getMessage());
            cardResponse.setResCode(CodeEnum.failed.getCode());
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse mealAdd(nmg_meal_info nmg_meal_info) {
        CardResponse cardResponse = new CardResponse();
        if (null == nmg_meal_info.getMealId() || "".equals(nmg_meal_info.getMealId())) {
            nmg_meal_info.setMealId(new RandomUtil().uuid);
            if (null != nmg_meal_info.getCity()){
                nmg_meal_info.setFlag("S");
            }
            nmg_meal_info.setState("1");
            nmg_meal_infoMapper.insert(nmg_meal_info);
        } else {
            try{
                nmg_meal_infoMapper.cardMealUpdate(nmg_meal_info);
            } catch (Exception e) {
                cardResponse.setResCode(CodeEnum.failed.getCode());
                cardResponse.setResDesc(e.getMessage());
            }
        }
        return cardResponse;
    }

    /**
     * 上下线
     * @param data
     * @return
     */
    @Transactional
    public CardResponse onoffLine(String data) {
        CardResponse cardResponse = new CardResponse();
        Object jsonObject = JSON.parse(data);
        JSONObject object = (JSONObject) jsonObject;
        Map check = nmg_meal_infoMapper.checkUse(object.get("mealId").toString());
        if (null != check && check.size()>0) {
            cardResponse.setResCode(CodeEnum.mealIsUsing.getCode());
            cardResponse.setResDesc("["+check.get("meal_name")+"]"+CodeEnum.mealIsUsing.getDesc());
        } else {
            Map param = new HashMap();
            param.put("state",object.get("state"));
            param.put("mealId",object.get("mealId"));
            nmg_meal_infoMapper.onoffLine(param);
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse cardMealDel(String data) {
        CardResponse cardResponse = new CardResponse();
        Object jsonObject = JSON.parse(data);
        JSONObject array = (JSONObject) jsonObject;
        JSONArray jsonArray = array.getJSONArray("meal");
        for (int i = 0; i < jsonArray.size(); i++) {
            nmg_meal_info nmg_meal_info = new nmg_meal_info();
            String mealCode = jsonArray.getString(i);
            nmg_meal_info.setMealCode(mealCode);
            Map check = nmg_meal_infoMapper.checkUse(mealCode);
            if (null != check && check.size() > 0) {
                cardResponse.setResCode(CodeEnum.mealIsUsing.getCode());
                cardResponse.setResDesc("["+check.get("meal_name")+"]"+CodeEnum.mealIsUsing.getDesc());
            } else {
                nmg_meal_infoMapper.cardMealDel(nmg_meal_info.getMealCode());
            }
        }
        return cardResponse;
    }
}
