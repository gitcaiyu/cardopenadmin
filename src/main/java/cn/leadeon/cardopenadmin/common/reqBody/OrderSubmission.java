package cn.leadeon.cardopenadmin.common.reqBody;

import cn.leadeon.cardopenadmin.entity.nmg_order_info;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class OrderSubmission {

    /**
     * 收件人名字
     */
    @NotBlank(message = "收件人名字不能为空")
    private String name;

    /**
     * 收件人联系方式
     */
    @NotBlank(message = "收件人联系方式不能为空")
    private String phone;

    /**
     * 渠道编码
     */
    @NotBlank(message = "渠道编码不能为空")
    private String code;

    /**
     * 渠道地址
     */
    @NotBlank(message = "渠道地址不能为空")
    private String address;

    /**
     * 申请开卡明细信息
     */
    private List<nmg_order_info> result;

}
