package cn.leadeon.cardopenadmin.entity;

import cn.leadeon.cardopenadmin.common.reqBody.BaseEntity;
import lombok.Data;

@Data
public class nmg_order_detail extends BaseEntity {
    private String detailId;

    private String orderId;

    private String batchId;

    private String cardnum;

    private String simnum;

    private String orderMeal;

    private String orderTariff;

    private String orderDiscount;
}