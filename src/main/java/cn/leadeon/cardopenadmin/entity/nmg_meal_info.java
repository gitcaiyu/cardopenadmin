package cn.leadeon.cardopenadmin.entity;

import cn.leadeon.cardopenadmin.common.reqBody.BaseEntity;
import lombok.Data;

@Data
public class nmg_meal_info extends BaseEntity {
    private String mealId;

    private String mealCode;

    private String mealName;

    private String city;

    private String flag = "T";
}