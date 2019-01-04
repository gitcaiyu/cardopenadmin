package cn.leadeon.cardopenadmin.entity;

import cn.leadeon.cardopenadmin.common.reqBody.BaseEntity;
import lombok.Data;

@Data
public class nmg_user_role extends BaseEntity {
    private String roleId;

    private String roleName;

    private String roleType;

    private String createTime;

    private String createPeople;
}