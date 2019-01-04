package cn.leadeon.cardopenadmin.entity;

import cn.leadeon.cardopenadmin.common.reqBody.BaseEntity;
import lombok.Data;

@Data
public class nmg_discount_info extends BaseEntity {
    private String discountId;

    private String discountCode;

    private String discountName;

    private String city;

    private String flag;
}