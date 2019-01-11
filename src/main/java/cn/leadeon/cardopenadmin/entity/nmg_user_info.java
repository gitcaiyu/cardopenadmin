package cn.leadeon.cardopenadmin.entity;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class nmg_user_info {
    private String userId;

    private String userName;

    @NotBlank(message = "密码不能为空")
    private String userPass;

    private String userRole;

    private String userType;

    @NotBlank(message = "手机号码不能为空")
    private String userTel;

    private String cityCode;

    private String flag = "Y";

    private String createTime;

    private String updateTime;

    private String createPeople;

    private int curr;

    private int limit;

    private int totalCount;
}