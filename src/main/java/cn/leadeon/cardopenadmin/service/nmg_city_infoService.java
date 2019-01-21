package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.entity.nmg_city_info;
import cn.leadeon.cardopenadmin.mapper.nmg_city_infoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class nmg_city_infoService {

    @Autowired
    private nmg_city_infoMapper nmg_city_infoMapper;

    public List<nmg_city_info> city() {
        return nmg_city_infoMapper.cityInfo(null);
    }

}
