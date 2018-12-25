package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.CodeEnum;
import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_meal_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.mapper.nmg_city_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_meal_infoMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public CardResponse mealUnify(nmg_meal_info nmg_meal_info) {
        CardResponse cardResponse = new CardResponse();
        try {
            Map param = new HashMap();
            Map results = new HashMap();
            List result = new ArrayList();
            if (null != nmg_meal_info.getMealId()) {
                param.put("mealId",nmg_meal_info.getMealId());
                results.put("city",nmg_city_infoMapper.cityInfo(null));
                result.add(results);
            }
            results.put("meal",nmg_meal_infoMapper.applyCardMeal(param));
            result.add(results);
            cardResponse.setResBody(result);
        } catch (Exception e) {
            cardResponse.setResDesc(e.getMessage());
            cardResponse.setResCode(CodeEnum.failed.getCode());
        }
        return cardResponse;
    }

    public CardResponse mealIndividualization(HttpSession httpSession,nmg_meal_info nmg_meal_info) {
        CardResponse cardResponse = new CardResponse();
        try {
            nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
            Map param = new HashMap();
            Map results = new HashMap();
            List result = new ArrayList();
            param.put("city",nmg_user_info.getCityCode());
            if (null != nmg_meal_info.getMealId()) {
                param.put("mealId",nmg_meal_info.getMealId());
                results.put("city",nmg_city_infoMapper.cityInfo(param));
                result.add(results);
            }
            results.put("meal",nmg_meal_infoMapper.applyCardMeal(param));
            result.add(results);
        } catch (Exception e) {
            cardResponse.setResDesc(e.getMessage());
            cardResponse.setResCode(CodeEnum.failed.getCode());
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse mealAdd(nmg_meal_info nmg_meal_info) {
        CardResponse cardResponse = new CardResponse();
        nmg_meal_infoMapper.insert(nmg_meal_info);
        return cardResponse;
    }

    @Transactional
    public CardResponse cardMealDel(nmg_meal_info nmg_meal_info) {
        CardResponse cardResponse = new CardResponse();
        nmg_meal_infoMapper.cardMealDel(nmg_meal_info.getMealId());
        return cardResponse;
    }

    @Transactional
    public CardResponse cardMealUpdate(nmg_meal_info nmg_meal_info) {
        CardResponse cardResponse = new CardResponse();
        try{
            nmg_meal_infoMapper.cardMealUpdate(nmg_meal_info);
        } catch (Exception e) {
            cardResponse.setResCode(CodeEnum.failed.getCode());
            cardResponse.setResDesc(e.getMessage());
        }
        return cardResponse;
    }
}
