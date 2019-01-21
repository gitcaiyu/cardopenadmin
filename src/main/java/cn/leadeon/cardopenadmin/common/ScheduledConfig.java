package cn.leadeon.cardopenadmin.common;

import cn.leadeon.cardopenadmin.mapper.nmg_order_infoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@EnableScheduling
@Component
public class ScheduledConfig {

    @Autowired
    private nmg_order_infoMapper nmg_order_infoMapper;

    @Scheduled(cron = "0 10 * * * ? ")
    public void updateState() {
        nmg_order_infoMapper.updateState();
    }

}
