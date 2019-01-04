package cn.leadeon.cardopenadmin.entity;

import cn.leadeon.cardopenadmin.common.reqBody.BaseEntity;
import lombok.Data;

@Data
public class nmg_county_info extends BaseEntity {
    private String countyId;

    private String countyName;

    private String cityCode;
}