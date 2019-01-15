package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.CodeEnum;
import cn.leadeon.cardopenadmin.common.DateUtil;
import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_order_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.mapper.nmg_city_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_county_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_order_detailMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_order_infoMapper;
import com.alibaba.fastjson.JSONObject;
import org.apache.ibatis.session.RowBounds;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class nmg_statistical_queryService {

    @Autowired
    private nmg_order_infoMapper nmg_order_infoMapper;

    @Autowired
    private nmg_order_detailMapper nmg_order_detailMapper;

    @Autowired
    private nmg_city_infoMapper nmg_city_infoMapper;

    @Autowired
    private nmg_county_infoMapper nmg_county_infoMapper;

    @Value("${file.path}")
    private String path;


    public CardResponse workExport(nmg_order_info nmg_order_info, HttpServletRequest httpServletRequest) {
        CardResponse cardResponse = new CardResponse();
        try {
            HttpSession httpSession = httpServletRequest.getSession();
            nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
            String fileName = path + nmg_user_info.getUserName() + "的工单统计信息" + DateUtil.getDateString()+".xls";;
            Map param = new HashMap();
            if (null != nmg_order_info.getCity() && !"".equals(nmg_order_info.getCity())) {
                param.put("city", nmg_order_info.getCity());
            }
            if (null != nmg_order_info.getCounty() && !"".equals(nmg_order_info.getCounty())) {
                param.put("county", nmg_order_info.getCounty());
            }
            if (null != nmg_order_info.getOrderMeal() && !"".equals(nmg_order_info.getOrderMeal())) {
                param.put("meal", nmg_order_info.getOrderMeal());
            }
            if (null != nmg_order_info.getOrderDiscount() && !"".equals(nmg_order_info.getOrderDiscount())) {
                param.put("discount", nmg_order_info.getOrderDiscount());
            }
            if (null != nmg_order_info.getOrderTariff() && !"".equals(nmg_order_info.getOrderTariff())) {
                param.put("tariff", nmg_order_info.getOrderTariff());
            }
            if (null != nmg_order_info.getOrderState() && !"".equals(nmg_order_info.getOrderState())) {
                param.put("state", nmg_order_info.getOrderState());
            }
            if (null != nmg_order_info.getSubTime() && !"".equals(nmg_order_info.getSubTime())) {
                param.put("subtime", nmg_order_info.getSubTime());
            }
            if (null != nmg_order_info.getCreateTime() && !"".equals(nmg_order_info.getCreateTime())) {
                param.put("createtime", nmg_order_info.getCreateTime());
            }
            List<Map<String, Object>> result = nmg_order_infoMapper.detail(param,new RowBounds());
            HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
            HSSFSheet sheet = hssfWorkbook.createSheet("工单统计");
            HSSFRow row = sheet.createRow(0);
            HSSFCell cell = row.createCell(0);
            cell.setCellValue("工单编号");
            cell = row.createCell(1);
            cell.setCellValue("申请时间");
            cell = row.createCell(2);
            cell.setCellValue("盟市");
            cell = row.createCell(3);
            cell.setCellValue("县区");
            cell = row.createCell(4);
            cell.setCellValue("社渠名称");
            cell = row.createCell(5);
            cell.setCellValue("社渠编码");
            cell = row.createCell(6);
            cell.setCellValue("工单状态");
            cell = row.createCell(7);
            cell.setCellValue("资费套餐");
            cell = row.createCell(8);
            cell.setCellValue("套餐代码");
            cell = row.createCell(9);
            cell.setCellValue("优惠促销");
            cell = row.createCell(10);
            cell.setCellValue("开卡数量");
            for (int i = 0; i < result.size(); i++) {
                Map maps = result.get(i);
                row = sheet.createRow(i+1);
                if (maps.get("order_id") != null) {
                    row.createCell(0).setCellValue((String) maps.get("order_id"));
                }
                if (maps.get("sub_time") != null) {
                    row.createCell(1).setCellValue((String) maps.get("sub_time"));
                }
                if (maps.get("city") != null) {
                    param.put("city",maps.get("city"));
                    row.createCell(2).setCellValue(nmg_city_infoMapper.cityInfo(param).get(0).getCityName());
                }
                if (maps.get("county") != null) {
                    param = new HashMap();
                    param.put("county",maps.get("county"));
                    Map county = nmg_county_infoMapper.countyInfo(param).get(0);
                    row.createCell(3).setCellValue((String) county.get("county_name"));
                }
                if (maps.get("channel_name") != null) {
                    row.createCell(4).setCellValue((String) maps.get("channel_name"));
                }
                if (maps.get("channel_id") != null) {
                    row.createCell(5).setCellValue((String) maps.get("channel_id"));
                }

                if (maps.get("order_state") != null) {
                    row.createCell(6).setCellValue((String) maps.get("order_state"));
                }
                if (maps.get("meal_name") != null) {
                    row.createCell(7).setCellValue((String) maps.get("meal_name"));
                }
                if (maps.get("meal_code") != null) {
                    row.createCell(8).setCellValue((String) maps.get("meal_code"));
                }
                if (maps.get("discount_name") != null) {
                    row.createCell(9).setCellValue((String) maps.get("discount_name"));
                }
                if (maps.get("order_count") != null) {
                    row.createCell(10).setCellValue((String) maps.get("order_count"));
                }
            }
            FileOutputStream fileOutputStream = new FileOutputStream(fileName);
            hssfWorkbook.write(fileOutputStream);
            fileOutputStream.close();
            hssfWorkbook.close();
            cardResponse.setResDesc(fileName);
        } catch (Exception e) {
            cardResponse.setResDesc(e.getMessage());
            cardResponse.setResCode(CodeEnum.failed.getCode());
        }
        return cardResponse;
    }

    /**
     * 工单明细导出
     * @param data
     * @return
     */
    public CardResponse simExport(String data,HttpServletRequest httpServletRequest) {
        CardResponse cardResponse = new CardResponse();
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
        String fileName = path + nmg_user_info.getUserName() + "的SIM卡计信息" + DateUtil.getDateString()+".xls";;
        Map param = new HashMap();
        try {
            JSONObject jsonObject = JSONObject.parseObject(data);
            if (null != jsonObject.get("orderMeal") && !"".equals(jsonObject.get("orderMeal"))) {
                param.put("orderMeal",jsonObject.get("orderMeal"));
            }
            if (null != jsonObject.get("orderTariff") && !"".equals(jsonObject.get("orderTariff"))) {
                param.put("orderTariff",jsonObject.get("orderTariff"));
            }
            if (null != jsonObject.get("orderDiscount") && !"".equals(jsonObject.get("orderDiscount"))) {
                param.put("orderDiscount",jsonObject.get("orderDiscount"));
            }
            if (null != jsonObject.get("orderState") && !"".equals(jsonObject.get("orderState"))) {
                param.put("orderState",jsonObject.get("orderState"));
            }
            if (null != jsonObject.get("cardnum") && !"".equals(jsonObject.get("cardnum"))) {
                param.put("cardnum",jsonObject.get("cardnum"));
            }
            if (null != jsonObject.get("simnum") && !"".equals(jsonObject.get("simnum"))) {
                param.put("simnum",jsonObject.get("simnum"));
            }
            if (null != jsonObject.get("subTime") && !"".equals(jsonObject.get("subTime"))) {
                param.put("subTime",jsonObject.get("subTime"));
                param.put("subTimeE",jsonObject.get("subTimeE"));
            }
            if (null != jsonObject.get("createTime") && !"".equals(jsonObject.get("createTime"))) {
                param.put("createTime",jsonObject.get("createTime"));
                param.put("createTimeE",jsonObject.get("createTimeE"));
            }
            HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
            HSSFSheet sheet= hssfWorkbook.createSheet("工单信息");
            HSSFRow row = sheet.createRow(0);
            HSSFCell cell = row.createCell(0);
            cell.setCellValue("工单编号");
            cell = row.createCell(1);
            cell.setCellValue("申请时间");
            cell = row.createCell(2);
            cell.setCellValue("开卡完成时间");
            cell = row.createCell(3);
            cell.setCellValue("套餐资费");
            cell = row.createCell(4);
            cell.setCellValue("资费代码");
            cell = row.createCell(5);
            cell.setCellValue("优惠促销");
            cell = row.createCell(6);
            cell.setCellValue("选购号码");
            cell = row.createCell(7);
            cell.setCellValue("SIM卡号");
            List<Map<String,Object>> result = nmg_order_infoMapper.exportOrder(param,new RowBounds());
            for (int i = 0; i < result.size(); i++) {
                Map maps = result.get(i);
                row = sheet.createRow(i+1);
                if (maps.get("order_id") != null) {
                    row.createCell(0).setCellValue((String) maps.get("order_id"));
                }
                if (maps.get("sub_time") != null) {
                    row.createCell(1).setCellValue((String) maps.get("sub_time"));
                }
                if (maps.get("create_time") != null) {
                    row.createCell(2).setCellValue((String) maps.get("create_time"));
                }
                if (maps.get("meal_name") != null) {
                    row.createCell(3).setCellValue((String) maps.get("meal_name"));
                }
                if (maps.get("meal_code") != null) {
                    row.createCell(4).setCellValue((String) maps.get("meal_code"));
                }
                if (maps.get("discount_name") != null) {
                    row.createCell(5).setCellValue((String) maps.get("discount_name"));
                }
                if (maps.get("cardNum") != null) {
                    row.createCell(6).setCellValue((String) maps.get("cardNum"));
                }
                if (maps.get("SIMNum") != null) {
                    row.createCell(7).setCellValue((String) maps.get("SIMNum"));
                }
            }
            FileOutputStream fileOutputStream = new FileOutputStream(fileName);
            hssfWorkbook.write(fileOutputStream);
            fileOutputStream.close();
            hssfWorkbook.close();
            cardResponse.setResDesc(fileName);
        } catch (Exception e) {
            cardResponse.setResCode(CodeEnum.failed.getCode());
            cardResponse.setResDesc(CodeEnum.failed.getDesc());
        }
        return cardResponse;
    }
}
