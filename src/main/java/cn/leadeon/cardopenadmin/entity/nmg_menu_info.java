package cn.leadeon.cardopenadmin.entity;

import cn.leadeon.cardopenadmin.common.reqBody.BaseEntity;
import lombok.Data;

@Data
public class nmg_menu_info extends BaseEntity {
    private String id;

    private String roleId;

    private String menuName;

    private String fatherId;

    private String fatherName;

    private String url;

    private String createTime;

    private String createPeople;

    private String updateTime;

    private String updatePeople;
}