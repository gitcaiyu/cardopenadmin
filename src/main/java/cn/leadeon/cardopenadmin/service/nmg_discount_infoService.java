package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.CodeEnum;
import cn.leadeon.cardopenadmin.common.RandomUtil;
import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_city_info;
import cn.leadeon.cardopenadmin.entity.nmg_discount_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.mapper.nmg_city_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_discount_infoMapper;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
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
public class nmg_discount_infoService {

    @Autowired
    private nmg_discount_infoMapper nmg_discount_infoMapper;

    @Autowired
    private nmg_city_infoMapper nmg_city_infoMapper;

    @Autowired
    private nmg_city_infoService nmg_city_infoService;

    public CardResponse discountUnify(nmg_discount_info nmg_discount_info,HttpServletRequest httpServletRequest) {
        CardResponse cardResponse = new CardResponse();
        try {
            Map param = new HashMap();
            Map result = new HashMap();
            HttpSession httpSession = httpServletRequest.getSession();
            nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
            if (null != nmg_discount_info.getDiscountId() && !"".equals(nmg_discount_info.getDiscountId())) {
                param.put("discountId",nmg_discount_info.getDiscountId());
                result.put("city",nmg_city_infoMapper.cityInfo(null));
            }
            if (nmg_user_info.getUserRole().equals("2")) {
                param.put("city",nmg_user_info.getCityCode());
                result.put("city",nmg_city_infoMapper.cityInfo(param));
            } else {
                List<nmg_city_info> city = nmg_city_infoService.city();
                result.put("city",city);
            }
            param.put("flag","T");
            param.put("unify","A");
            result.put("discount",nmg_discount_infoMapper.applyCardDisc(param));
            cardResponse.setResBody(result);
        } catch (Exception e) {
            cardResponse.setResDesc(e.getMessage());
            cardResponse.setResCode(CodeEnum.failed.getCode());
        }
        return cardResponse;
    }

    public CardResponse mealIndividualization(HttpServletRequest httpServletRequest, nmg_discount_info nmg_discount_info) {
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
            if (null != nmg_discount_info.getDiscountId() && !"".equals(nmg_discount_info.getDiscountId())) {
                param.put("discountId",nmg_discount_info.getDiscountId());
                results.put("city",nmg_city_infoMapper.cityInfo(param));
            }
            results.put("discount",nmg_discount_infoMapper.applyCardDisc(param));
            cardResponse.setResBody(results);
        } catch (Exception e) {
            cardResponse.setResDesc(e.getMessage());
            cardResponse.setResCode(CodeEnum.failed.getCode());
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse mealAdd(nmg_discount_info nmg_discount_info) {
        CardResponse cardResponse = new CardResponse();
        if (null == nmg_discount_info.getDiscountId() || "".equals(nmg_discount_info.getDiscountId())) {
            nmg_discount_info.setDiscountId(new RandomUtil().uuid);
            if (null != nmg_discount_info.getCity()){
                nmg_discount_info.setFlag("S");
            }
            nmg_discount_info.setState("1");
            nmg_discount_infoMapper.insert(nmg_discount_info);
        } else {
            try{
                nmg_discount_infoMapper.cardDiscountUpdate(nmg_discount_info);
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
        Map check = nmg_discount_infoMapper.checkUse(object.get("discountId").toString());
        if (null != check && check.size()>0) {
            cardResponse.setResCode(CodeEnum.mealIsUsing.getCode());
            cardResponse.setResDesc("["+check.get("discount_name")+"]"+CodeEnum.mealIsUsing.getDesc());
        } else {
            Map param = new HashMap();
            param.put("state",object.get("state"));
            param.put("discountId",object.get("discountId"));
            nmg_discount_infoMapper.onoffLine(param);
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse cardMealDel(String data) {
        CardResponse cardResponse = new CardResponse();
        Object jsonObject = JSON.parse(data);
        JSONObject array = (JSONObject) jsonObject;
        JSONArray jsonArray = array.getJSONArray("discount");
        for (int i = 0; i < jsonArray.size(); i++) {
            nmg_discount_info nmg_meal_info = new nmg_discount_info();
            String mealCode = jsonArray.getString(i);
            nmg_meal_info.setDiscountId(mealCode);
            Map check = nmg_discount_infoMapper.checkUse(mealCode);
            if (null != check && check.size() > 0) {
                cardResponse.setResCode(CodeEnum.mealIsUsing.getCode());
                cardResponse.setResDesc("["+check.get("discount_name")+"]"+CodeEnum.mealIsUsing.getDesc());
            } else {
                nmg_discount_infoMapper.cardDiscountDel(nmg_meal_info.getDiscountId());
            }
        }
        return cardResponse;
    }
}
