package cn.leadeon.cardopenadmin.entity;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class nmg_user_info {
    private String userId;

    @NotBlank(message = "用户名不能为空")
    private String userName;

    @NotBlank(message = "密码不能为空")
    private String userPass;

    private String userRole;

    private String userType;

    private String userTel;

    private String cityCode;

    private String flag;

    private String createTime;

    private String updateTime;
}