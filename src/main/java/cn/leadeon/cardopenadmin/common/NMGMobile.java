package cn.leadeon.cardopenadmin.common;

import cn.leadeon.cardopenadmin.mapper.nmg_section_listMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NMGMobile {

    @Autowired
    private nmg_section_listMapper nmg_section_listMapper;

    /**
     * 校验当前手机号码是否是内蒙移动手机号
     * @param phone
     * @return
     */
    public boolean isValid(String phone) {
        boolean flag = true;
        if (null == nmg_section_listMapper.isValid(phone)) {
            flag = false;
        }
        return flag;
    }

}
