package cn.leadeon.cardopenadmin.entity;

import cn.leadeon.cardopenadmin.common.reqBody.BaseEntity;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class nmg_user_info extends BaseEntity {
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
}