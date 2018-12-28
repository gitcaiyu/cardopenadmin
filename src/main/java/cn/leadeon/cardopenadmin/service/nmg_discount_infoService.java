package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.CodeEnum;
import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_discount_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.mapper.nmg_city_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_discount_infoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public CardResponse discountUnify(nmg_discount_info nmg_discount_info) {
        CardResponse cardResponse = new CardResponse();
        try {
            Map param = new HashMap();
            Map results = new HashMap();
            List result = new ArrayList();
            if (null != nmg_discount_info.getDiscountId()) {
                param.put("discountId",nmg_discount_info.getDiscountId());
                results.put("city",nmg_city_infoMapper.cityInfo(null));
                result.add(results);
            }
            results.put("discount",nmg_discount_infoMapper.applyCardDisc(param));
            result.add(results);
            cardResponse.setResBody(result);
        } catch (Exception e) {
            cardResponse.setResDesc(e.getMessage());
            cardResponse.setResCode(CodeEnum.failed.getCode());
        }
        return cardResponse;
    }

    public CardResponse mealIndividualization(HttpSession httpSession, nmg_discount_info nmg_discount_info) {
        CardResponse cardResponse = new CardResponse();
        try {
            nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
            Map param = new HashMap();
            Map results = new HashMap();
            List result = new ArrayList();
            param.put("city",nmg_user_info.getCityCode());
            if (null != nmg_discount_info.getDiscountId()) {
                param.put("discountId",nmg_discount_info.getDiscountId());
                results.put("city",nmg_city_infoMapper.cityInfo(param));
                result.add(results);
            }
            results.put("discount",nmg_discount_infoMapper.applyCardDisc(param));
            result.add(results);
        } catch (Exception e) {
            cardResponse.setResDesc(e.getMessage());
            cardResponse.setResCode(CodeEnum.failed.getCode());
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse mealAdd(nmg_discount_info nmg_discount_info) {
        CardResponse cardResponse = new CardResponse();
        nmg_discount_infoMapper.insert(nmg_discount_info);
        return cardResponse;
    }

    @Transactional
    public CardResponse cardMealDel(nmg_discount_info nmg_discount_info) {
        CardResponse cardResponse = new CardResponse();
        nmg_discount_infoMapper.cardDiscountDel(nmg_discount_info.getDiscountId());
        return cardResponse;
    }

    @Transactional
    public CardResponse cardMealUpdate(nmg_discount_info nmg_discount_info) {
        CardResponse cardResponse = new CardResponse();
        try{
            nmg_discount_infoMapper.cardDiscountUpdate(nmg_discount_info);
        } catch (Exception e) {
            cardResponse.setResCode(CodeEnum.failed.getCode());
            cardResponse.setResDesc(e.getMessage());
        }
        return cardResponse;
    }
}
