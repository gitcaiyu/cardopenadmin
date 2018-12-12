package cn.leadeon.cardopenadmin.entity;

import lombok.Data;

@Data
public class nmg_user_info {
    private String userId;

    private String userName;

    private String userPass;

    private String userRole;

    private String userType;

    private String userTel;

    private String cityCode;

    private String flag;

    private String createTime;

    private String updateTime;
}