package cn.leadeon.cardopenadmin.mapper;

import cn.leadeon.cardopenadmin.entity.nmg_meal_info;

import java.util.List;
import java.util.Map;

public interface nmg_meal_infoMapper {
    int insert(nmg_meal_info record);

    int insertSelective(nmg_meal_info record);

    /**
     * 获取所有套餐列表
     * @return
     */
    List<Map<String,String>> applyCardMeal(Map param);

    int cardMealDel(String mealId);

    int cardMealUpdate(nmg_meal_info nmg_meal_info);

    Map checkUse(String mealCode);

    int onoffLine(Map param);
}