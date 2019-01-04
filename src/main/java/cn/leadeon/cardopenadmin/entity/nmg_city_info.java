package cn.leadeon.cardopenadmin.entity;

import cn.leadeon.cardopenadmin.common.reqBody.BaseEntity;
import lombok.Data;

@Data
public class nmg_city_info extends BaseEntity {
    private String cityId;

    private String cityName;

    private String cityCode;

    private String createTime;

    private String createPeople;

    private String updateTime;

    private String updatePeople;
}