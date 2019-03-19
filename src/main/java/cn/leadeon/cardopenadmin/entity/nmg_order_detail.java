package cn.leadeon.cardopenadmin.entity;

public class nmg_order_detail {
    private String detailId;

    private String orderId;

    private String batchId;

    private String cardnum;

    private String simnum;

    private String orderMeal;

    private String orderTariff;

    private String orderDiscount;

    private int curr;

    private int limit;

    private int totalCount;

    public String getDetailId() {
        return detailId;
    }

    public void setDetailId(String detailId) {
        this.detailId = detailId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public String getCardnum() {
        return cardnum;
    }

    public void setCardnum(String cardnum) {
        this.cardnum = cardnum;
    }

    public String getSimnum() {
        return simnum;
    }

    public void setSimnum(String simnum) {
        this.simnum = simnum;
    }

    public String getOrderMeal() {
        return orderMeal;
    }

    public void setOrderMeal(String orderMeal) {
        this.orderMeal = orderMeal;
    }

    public String getOrderTariff() {
        return orderTariff;
    }

    public void setOrderTariff(String orderTariff) {
        this.orderTariff = orderTariff;
    }

    public String getOrderDiscount() {
        return orderDiscount;
    }

    public void setOrderDiscount(String orderDiscount) {
        this.orderDiscount = orderDiscount;
    }

    public int getCurr() {
        return curr;
    }

    public void setCurr(int curr) {
        this.curr = curr;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }
}