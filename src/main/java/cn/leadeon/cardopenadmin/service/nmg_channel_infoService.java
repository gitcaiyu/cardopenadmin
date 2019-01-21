package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.Common;
import cn.leadeon.cardopenadmin.common.DateUtil;
import cn.leadeon.cardopenadmin.common.RandomUtil;
import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_channel_info;
import cn.leadeon.cardopenadmin.entity.nmg_city_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.mapper.nmg_channel_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_city_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_county_infoMapper;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.ibatis.session.RowBounds;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class nmg_channel_infoService {

    @Autowired
    private nmg_channel_infoMapper nmg_channel_infoMapper;

    @Autowired
    private nmg_city_infoMapper nmg_city_infoMapper;

    @Autowired
    private nmg_county_infoMapper nmg_county_infoMapper;

    @Autowired
    private nmg_city_infoService nmg_city_infoService;

    @Value("${file.path}")
    private String path;

    public CardResponse channel (nmg_channel_info nmg_channel_info, HttpServletRequest httpServletRequest) {
        CardResponse cardResponse = new CardResponse();
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
        Map param = new HashMap();
        Map result = new HashMap();
        //如果是盟市管理员，则仅能查看当前负责盟市的渠道信息
        if (nmg_user_info.getUserRole().equals("2")) {
            param.put("city",nmg_user_info.getCityCode());
//            param.put("chargeTel",nmg_user_info.getUserTel());
            result.put("city",nmg_city_infoMapper.cityInfo(param));
            result.put("county",nmg_county_infoMapper.countyInfo(param));
        } else {
            if (null != nmg_channel_info.getCity() && !"".equals(nmg_channel_info.getCity())) {
                param.put("city",nmg_channel_info.getCity());
            }
            List<nmg_city_info> city = nmg_city_infoService.city();
            result.put("city",city);
            result.put("county", nmg_county_infoMapper.countyInfo(param));
        }
        if (null != nmg_channel_info.getChannelName() && !"".equals(nmg_channel_info.getChannelName())) {
            param.put("channelName",nmg_channel_info.getChannelName());
        }
        if (null != nmg_channel_info.getChannelId() && !"".equals(nmg_channel_info.getChannelId())) {
            param.put("channelId",nmg_channel_info.getChannelId());
        }
        if (null != nmg_channel_info.getChargeName() && !"".equals(nmg_channel_info.getChargeName())) {
            param.put("chargeName",nmg_channel_info.getChargeName());
        }
        if (null != nmg_channel_info.getChargeTel() && !"".equals(nmg_channel_info.getChargeTel())) {
            param.put("chargeTel",nmg_channel_info.getChargeTel());
        }
        if (null != nmg_channel_info.getCounty() && !"".equals(nmg_channel_info.getCounty())) {
            param.put("county",nmg_channel_info.getCounty());
        }
        if (null != nmg_channel_info.getChannelType() && !"".equals(nmg_channel_info.getChannelType())) {
            param.put("channelType",nmg_channel_info.getChannelType());
        }
        RowBounds rowBounds = new RowBounds((nmg_channel_info.getCurr() - 1) * nmg_channel_info.getLimit(),nmg_channel_info.getLimit());
        List<Map<String,Object>> myChannelInfo = nmg_channel_infoMapper.myChannelInfo(param,rowBounds);
        result.put("channel",myChannelInfo);
        result.put("channelType",new Common().channelType());
        cardResponse.setResBody(result);
        cardResponse.setTotalCount(nmg_channel_infoMapper.totalCount(param));
        return cardResponse;
    }

    @Transactional
    public CardResponse channelAdd(nmg_channel_info nmg_channel_info) {
        CardResponse cardResponse = new CardResponse();
        if (null == nmg_channel_info.getChannelId()||"".equals(nmg_channel_info.getChannelId().trim())) {
            nmg_channel_info.setChannelId(new RandomUtil().uuid);
            nmg_channel_info.setChannelType("1");
            nmg_channel_infoMapper.insert(nmg_channel_info);
        } else {
            nmg_channel_infoMapper.channelUpdate(nmg_channel_info);
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse channelDel(String data) {
        CardResponse cardResponse = new CardResponse();
        Object jsonObject = JSON.parse(data);
        JSONObject array = (JSONObject) jsonObject;
        JSONArray jsonArray = array.getJSONArray("channelId");
        for (int i = 0; i < jsonArray.size(); i++) {
            nmg_channel_infoMapper.channelDel(jsonArray.get(i).toString());
        }
        return cardResponse;
    }

    public CardResponse channelExport(nmg_channel_info nmg_channel_info,HttpServletRequest httpServletRequest) throws IOException {
        CardResponse cardResponse = new CardResponse();
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
        Map param = new HashMap();
        String fileName = path + nmg_user_info.getUserName() + "的渠道信息" + DateUtil.getDateString() + ".xls";
        if (!nmg_user_info.getUserRole().equals("2")) {
            param.put("chargeTel",nmg_user_info.getUserTel());
        } else {
            param.put("city",nmg_channel_info.getCity());
        }
        if (null != nmg_channel_info.getChannelName() && !"".equals(nmg_channel_info.getChannelName())) {
            param.put("channelName",nmg_channel_info.getChannelName());
        }
        if (null != nmg_channel_info.getChannelId() && !"".equals(nmg_channel_info.getChannelId())) {
            param.put("channelId",nmg_channel_info.getChannelId());
        }
        if (null != nmg_channel_info.getChargeName() && !"".equals(nmg_channel_info.getChargeName())) {
            param.put("chargeName",nmg_channel_info.getChargeName());
        }
        if (null != nmg_channel_info.getChargeTel() && !"".equals(nmg_channel_info.getChargeTel())) {
            param.put("chargeTel",nmg_channel_info.getChargeTel());
        }
        if (null != nmg_channel_info.getCounty() && !"".equals(nmg_channel_info.getCounty())) {
            param.put("county",nmg_channel_info.getCounty());
        }
        if (null != nmg_channel_info.getChannelType() && !"".equals(nmg_channel_info.getChannelType())) {
            param.put("channelType",nmg_channel_info.getChannelType());
        }
        HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
        HSSFSheet sheet= hssfWorkbook.createSheet("工单信息");
        HSSFRow row = sheet.createRow(0);
        HSSFCell cell = row.createCell(0);
        cell.setCellValue("渠道编码");
        cell = row.createCell(1);
        cell.setCellValue("渠道名称");
        cell = row.createCell(2);
        cell.setCellValue("渠道类型");
        cell = row.createCell(3);
        cell.setCellValue("盟市");
        cell = row.createCell(4);
        cell.setCellValue("县区");
        cell = row.createCell(5);
        cell.setCellValue("负责人");
        cell = row.createCell(6);
        cell.setCellValue("负责人机号");
        cell = row.createCell(7);
        cell.setCellValue("渠道地址");
        List<Map<String,Object>> result = nmg_channel_infoMapper.myChannelInfo(param,new RowBounds());
        for (int i = 0; i < result.size(); i++) {
            Map maps = result.get(i);
            row = sheet.createRow(i + 1);
            if (null != maps.get("channel_id")) {
                row.createCell(0).setCellValue((String) maps.get("channel_id"));
            }
            if (null != maps.get("channel_name")) {
                row.createCell(1).setCellValue((String) maps.get("channel_name"));
            }
            if (null != maps.get("channel_type")) {
                row.createCell(2).setCellValue((String) maps.get("channel_type"));
            }
            if (null != maps.get("city_name")) {
                row.createCell(3).setCellValue((String) maps.get("city_name"));
            }
            if (null != maps.get("county_name")) {
                row.createCell(4).setCellValue((String) maps.get("county_name"));
            }
            if (null != maps.get("charge_name")) {
                row.createCell(5).setCellValue((String) maps.get("charge_name"));
            }
            if (null != maps.get("charge_tel")) {
                row.createCell(6).setCellValue((String) maps.get("charge_tel"));
            }
            if (null != maps.get("channel_address")) {
                row.createCell(7).setCellValue((String) maps.get("channel_address"));
            }
        }
        FileOutputStream fileOutputStream = new FileOutputStream(fileName);
        hssfWorkbook.write(fileOutputStream);
        fileOutputStream.close();
        hssfWorkbook.close();
        cardResponse.setResDesc(fileName);
        return cardResponse;
    }

    @Transactional
    public CardResponse batchImport(MultipartFile file) throws IOException {
        CardResponse cardResponse = new CardResponse();
        InputStream inputStream = file.getInputStream();
        HSSFWorkbook xssfWorkbook = new HSSFWorkbook(inputStream);
        int numberOfSheets = xssfWorkbook.getNumberOfSheets();
        for (int i = 0; i < numberOfSheets; i++) {
            HSSFSheet sheetAt = xssfWorkbook.getSheetAt(i);
            int lastRowNum = sheetAt.getLastRowNum();
            for (int j = 1; j <= lastRowNum; j++) {
                Map param = new HashMap();
                nmg_channel_info nmg_channel_info = new nmg_channel_info();
                HSSFRow row = sheetAt.getRow(j);
                //渠道ID
                nmg_channel_info.setChannelId(row.getCell(0).getStringCellValue());
                //渠道名称
                nmg_channel_info.setChannelName(row.getCell(1).getStringCellValue());
                //渠道类型
                if ("社会渠道".equals(row.getCell(2).getStringCellValue())) {
                    nmg_channel_info.setChannelType("1");
                } else {
                    nmg_channel_info.setChannelType("2");
                }
                //盟市
                param.put("cityName", row.getCell(3).getStringCellValue());
                nmg_city_info city = nmg_city_infoMapper.cityInfo(param).get(0);
                nmg_channel_info.setCity(city.getCityCode());
                Map county = nmg_county_infoMapper.countyInfo(param).get(0);
                nmg_channel_info.setCounty(county.get("county_id").toString());
                nmg_channel_info.setChargeName(row.getCell(5).getStringCellValue());
                nmg_channel_info.setChargeTel(row.getCell(6).getStringCellValue());
                nmg_channel_info.setChannelAddress(row.getCell(7).getStringCellValue());
                if (nmg_channel_infoMapper.isExists(nmg_channel_info) == 0) {
                    nmg_channel_infoMapper.insert(nmg_channel_info);
                } else {
                    nmg_channel_infoMapper.channelUpdate(nmg_channel_info);
                }
            }
        }
        return cardResponse;
    }

}
