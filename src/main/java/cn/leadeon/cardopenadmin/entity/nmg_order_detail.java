package cn.leadeon.cardopenadmin.entity;

import lombok.Data;

@Data
public class nmg_order_detail {
    private String detailId;

    private String orderId;

    private String batchId;

    private String cardnum;

    private String simnum;
}