package cn.leadeon.cardopenadmin.service;

import cn.leadeon.cardopenadmin.common.*;
import cn.leadeon.cardopenadmin.common.resBody.CardResponse;
import cn.leadeon.cardopenadmin.entity.nmg_city_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_info;
import cn.leadeon.cardopenadmin.entity.nmg_user_role;
import cn.leadeon.cardopenadmin.mapper.nmg_city_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_user_infoMapper;
import cn.leadeon.cardopenadmin.mapper.nmg_user_roleMapper;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.ibatis.session.RowBounds;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.Cell;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class nmg_user_infoService {

    @Autowired
    private nmg_menu_infoService nmg_menu_infoService;

    @Autowired
    private nmg_user_infoMapper nmg_user_infoMapper;

    @Autowired
    private nmg_user_roleMapper nmg_user_roleMapper;

    @Autowired
    private nmg_city_infoMapper nmg_city_infoMapper;

    @Value("${file.path}")
    private String path;

    public CardResponse userLogin(nmg_user_info nmg_user_info, HttpServletRequest httpServletRequest) {
        CardResponse cardResponse = new CardResponse();
        Map param = new HashMap();
        param.put("userTel",nmg_user_info.getUserTel());
        param.put("userPass",nmg_user_info.getUserPass());
        nmg_user_info userInfo = nmg_user_infoMapper.userValid(param);
        if (userInfo != null) {
            HttpSession httpSession = httpServletRequest.getSession();
            httpSession.setAttribute("userInfo", userInfo);
        } else {
            cardResponse.setResCode(CodeEnum.loginFaild.getCode());
            cardResponse.setResDesc(CodeEnum.loginFaild.getDesc());
        }
        return cardResponse;
    }

    public CardResponse menu(HttpServletRequest httpServletRequest) {
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info userInfo = (nmg_user_info) httpSession.getAttribute("userInfo");
        CardResponse cardResponse = new CardResponse();
        Map result = new HashMap();
        result.put("menu",nmg_menu_infoService.menuList(userInfo.getUserRole()));
        result.put("userName",userInfo.getUserTel());
        cardResponse.setResBody(result);
        return cardResponse;
    }

    public CardResponse userManage(String data) {
        CardResponse cardResponse = new CardResponse();
        if (data != null) {
            try {
                JSONObject jsonObject = JSONObject.parseObject(data);
                Map param = new HashMap();
                if (null != jsonObject.get("userName") && !"".equals(jsonObject.get("userName"))) {
                    param.put("userName",jsonObject.get("userName"));
                }
                if (null != jsonObject.get("userTel") && !"".equals(jsonObject.get("userTel"))) {
                    param.put("userTel",jsonObject.get("userTel"));
                }
                if (null != jsonObject.get("userRole") && !"".equals(jsonObject.get("userRole"))) {
                    param.put("userRole",jsonObject.get("userRole"));
                }
                RowBounds rowBounds = new RowBounds((jsonObject.getInteger("curr") - 1) * jsonObject.getInteger("limit"),jsonObject.getInteger("limit"));
                List<Map<String,Object>> allUserInfo = nmg_user_infoMapper.allUserInfo(param,rowBounds);
                Map result = new HashMap();
                result.put("user",allUserInfo);
                result.put("roleList",nmg_user_roleMapper.userRole(null,new RowBounds()));
                result.put("city",nmg_city_infoMapper.cityInfo(null));
                cardResponse.setTotalCount(nmg_user_infoMapper.allUserTotal(param));
                cardResponse.setResBody(result);
            } catch (Exception e) {
                cardResponse.setResDesc(e.getMessage());
                cardResponse.setResCode(CodeEnum.failed.getCode());
            }
        } else {
            cardResponse.setResCode(CodeEnum.nullValue.getCode());
            cardResponse.setResDesc(CodeEnum.nullValue.getDesc());
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse userAdd(nmg_user_info nmg_user_info,HttpServletRequest httpServletRequest) {
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info user = (nmg_user_info) httpSession.getAttribute("userInfo");
        CardResponse cardResponse = new CardResponse();
        nmg_user_info.setUserId(new RandomUtil().uuid);
        nmg_user_info.setCreateTime(DateUtil.getDateString());
        nmg_user_info.setCreatePeople(user.getUserTel());
        nmg_user_infoMapper.insert(nmg_user_info);
        return cardResponse;
    }

    @Transactional
    public CardResponse userDel(String data) {
        CardResponse cardResponse = new CardResponse();
        Object jsonObject = JSON.parse(data);
        JSONObject array = (JSONObject) jsonObject;
        JSONArray jsonArray = array.getJSONArray("detail");
        for (int i = 0; i < jsonArray.size(); i++) {
            nmg_user_infoMapper.userDel(jsonArray.getString(i));
        }
        return cardResponse;
    }

    public CardResponse roleManage(String data) {
        CardResponse cardResponse = new CardResponse();
        if (data != null) {
            try {
                Map param = new HashMap();
                JSONObject jsonObject = JSONObject.parseObject(data);
                if (null != jsonObject.get("createPeople") && !"".equals(jsonObject.get("createPeople"))) {
                    param.put("createPeople",jsonObject.get("createPeople"));
                }
                if (null != jsonObject.get("roleType") && !"".equals(jsonObject.get("roleType"))) {
                    param.put("roleType",jsonObject.get("roleType"));
                }
                Map res = new HashMap();
                RowBounds rowBounds = new RowBounds((jsonObject.getInteger("curr") - 1) * jsonObject.getInteger("limit"),jsonObject.getInteger("limit"));
                List result = nmg_user_roleMapper.userRole(param,rowBounds);
                res.put("role",result);
                res.put("roleList",nmg_user_roleMapper.userRole(null,new RowBounds()));
                cardResponse.setResBody(res);
                cardResponse.setTotalCount(nmg_user_roleMapper.userRoleTotal(param));
            } catch (Exception e) {
                cardResponse.setResDesc(e.getMessage());
                cardResponse.setResCode(CodeEnum.failed.getCode());
            }
        } else {
            cardResponse.setResCode(CodeEnum.nullValue.getCode());
            cardResponse.setResDesc(CodeEnum.nullValue.getDesc());
        }
        return cardResponse;
    }


    @Transactional
    public CardResponse userImport(MultipartFile file,HttpServletRequest httpServletRequest) throws IOException {
        CardResponse cardResponse = new CardResponse();
        if (file != null) {
            InputStream inputStream = file.getInputStream();
            HSSFWorkbook xssfWorkbook = new HSSFWorkbook(inputStream);
            HttpSession httpSession = httpServletRequest.getSession();
            nmg_user_info userInfo = (nmg_user_info) httpSession.getAttribute("userInfo");
            int numberOfSheets = xssfWorkbook.getNumberOfSheets();
            Map param = new HashMap();
            for (int i = 0; i < numberOfSheets; i++) {
                HSSFSheet sheetAt = xssfWorkbook.getSheetAt(i);
                int lastRowNum = sheetAt.getLastRowNum();
                for (int j = 1; j <= lastRowNum; j++) {
                    nmg_user_info nmg_user_info = new nmg_user_info();
                    HSSFRow row = sheetAt.getRow(j);
                    nmg_user_info.setUserId(new RandomUtil().uuid);
                    row.getCell(0).setCellType(Cell.CELL_TYPE_STRING);
                    nmg_user_info.setUserTel(row.getCell(0).getStringCellValue());
                    row.getCell(1).setCellType(Cell.CELL_TYPE_STRING);
                    nmg_user_info.setUserPass(row.getCell(1).getStringCellValue());
                    row.getCell(2).setCellType(Cell.CELL_TYPE_STRING);
                    nmg_user_info.setUserName(row.getCell(2).getStringCellValue());
                    param.put("cityName",row.getCell(3).getStringCellValue());
                    nmg_user_info.setCityCode(nmg_city_infoMapper.cityInfo(param).get(0).getCityCode());
                    param.put("role_name",row.getCell(4).getStringCellValue());
                    String role = nmg_user_roleMapper.userRole(param,new RowBounds()).get(0).get("role_id").toString();
                    nmg_user_info.setUserRole(role);
                    nmg_user_info.setUserType(role);
                    nmg_user_info.setCreateTime(DateUtil.getDateString());
                    nmg_user_info.setCreatePeople(userInfo.getUserTel());
                    nmg_user_infoMapper.insert(nmg_user_info);
                }
            }
        } else {
            cardResponse.setResCode(CodeEnum.nullValue.getCode());
            cardResponse.setResDesc(CodeEnum.nullValue.getDesc());
        }
        return cardResponse;
    }

    public void userExport(HttpServletRequest httpServletRequest,HttpServletResponse httpServletResponse,JSONObject jsonObject) {
        CardResponse cardResponse = new CardResponse();
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info user = (nmg_user_info) httpSession.getAttribute("userInfo");
        String fileName = user.getUserName() +"用户信息"+DateUtil.getDateString()+".xls";
        Map param = new HashMap();
        if (jsonObject != null) {
            try {
                HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
                HSSFSheet sheet= hssfWorkbook.createSheet("用户信息");
                HSSFRow row = sheet.createRow(0);
                HSSFCell cell = row.createCell(0);
                cell.setCellValue("账号");
                cell = row.createCell(1);
                cell.setCellValue("密码");
                cell = row.createCell(2);
                cell.setCellValue("姓名");
                cell = row.createCell(3);
                cell.setCellValue("盟市");
                cell = row.createCell(4);
                cell.setCellValue("角色名称");
                cell = row.createCell(5);
                cell.setCellValue("创建时间");
                cell = row.createCell(6);
                cell.setCellValue("创建人账户");
                if (null != jsonObject.get("userName") && !"".equals(jsonObject.get("userName"))) {
                    param.put("userName",jsonObject.get("userName"));
                }
                if (null != jsonObject.get("userTel") && !"".equals(jsonObject.get("userTel"))) {
                    param.put("userTel",jsonObject.get("userTel"));
                }
                if (null != jsonObject.get("userRole") && !"".equals(jsonObject.get("userRole"))) {
                    param.put("userRole",jsonObject.get("userRole"));
                }
                List<Map<String,Object>> result = nmg_user_infoMapper.allUserInfo(param,new RowBounds());
                for (int i = 0; i < result.size(); i++) {
                    Map maps = result.get(i);
                    row = sheet.createRow(i+1);
                    if (maps.get("user_tel") != null) {
                        row.createCell(0).setCellValue((String) maps.get("user_tel"));
                    }
                    if (maps.get("user_pass") != null) {
                        row.createCell(1).setCellValue((String) maps.get("user_pass"));
                    }
                    if (maps.get("user_name") != null) {
                        row.createCell(2).setCellValue((String) maps.get("user_name"));
                    }
                    if (maps.get("city_code") != null) {
                        param.put("city",maps.get("city"));
                        row.createCell(3).setCellValue(nmg_city_infoMapper.cityInfo(param).get(0).getCityName());
                    }
                    if (maps.get("user_role") != null) {
                        param.put("role_id",maps.get("user_role"));
                        row.createCell(4).setCellValue(nmg_user_roleMapper.userRole(param,new RowBounds()).get(0).get("role_name").toString());
                    }
                    if (maps.get("create_time") != null) {
                        row.createCell(5).setCellValue((String) maps.get("create_time"));
                    }
                    if (maps.get("create_people") != null) {
                        row.createCell(6).setCellValue((String) maps.get("create_people"));
                    }
                }
//                FileOutputStream fileOutputStream = new FileOutputStream(fileName);
//                hssfWorkbook.write(fileOutputStream);
//                fileOutputStream.close();
//                hssfWorkbook.close();
//                cardResponse.setResDesc(fileName);
                httpServletResponse.setContentType("application/octet-stream");
                httpServletResponse.setHeader("Content-Disposition", "attachment;fileName="+fileName);
                httpServletResponse.flushBuffer();
                hssfWorkbook.write(httpServletResponse.getOutputStream());
            } catch (Exception e) {
                cardResponse.setResDesc(e.getMessage());
                cardResponse.setResCode(CodeEnum.failed.getCode());
            }
        } else {
            cardResponse.setResCode(CodeEnum.nullValue.getCode());
            cardResponse.setResDesc(CodeEnum.nullValue.getDesc());
        }
//        return cardResponse;
    }

    @Transactional
    public CardResponse roleAdd(nmg_user_role nmg_user_role,HttpServletRequest httpServletRequest) {
        CardResponse cardResponse = new CardResponse();
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info user = (nmg_user_info) httpSession.getAttribute("userInfo");
        if (nmg_user_role.getRoleId().equals("")) {
            nmg_user_role.setRoleId(new RandomUtil().uuid);
            nmg_user_role.setCreatePeople(user.getUserTel());
            nmg_user_role.setCreateTime(DateUtil.getDateString("yyyy-MM-dd hh:mm:ss"));
            nmg_user_roleMapper.insert(nmg_user_role);
        } else {
            nmg_user_roleMapper.roleUpdate(nmg_user_role);
        }
        return cardResponse;
    }

    @Transactional
    public CardResponse roleDel(String data) {
        CardResponse cardResponse = new CardResponse();
        Object jsonObject = JSON.parse(data);
        JSONObject array = (JSONObject) jsonObject;
        JSONArray jsonArray = array.getJSONArray("detail");
        for (int i = 0; i < jsonArray.size(); i++) {
            nmg_user_roleMapper.roleDel(jsonArray.getString(i));
        }
        return cardResponse;
    }

    public CardResponse userTemplate(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        CardResponse cardResponse = new CardResponse();
        HttpSession httpSession = httpServletRequest.getSession();
        nmg_user_info nmg_user_info = (nmg_user_info) httpSession.getAttribute("userInfo");
        Map param = new HashMap();
        String fileName = "用户信息模板.xls";
        if (nmg_user_info.getUserRole().equals("2")) {
            param.put("city",nmg_user_info.getCityCode());
        } else {
            param.put("flag","T");
        }
        HSSFWorkbook hssfWorkbook = new HSSFWorkbook();
        HSSFSheet sheet= hssfWorkbook.createSheet("用户信息");
        HSSFCellStyle textStyle = hssfWorkbook.createCellStyle();
        HSSFDataFormat format = hssfWorkbook.createDataFormat();
        textStyle.setDataFormat(format.getFormat("@"));
        HSSFRow row = sheet.createRow(0);
        HSSFCell cell = row.createCell(0);
        cell.setCellValue("账号");
        cell = row.createCell(1);
        cell.setCellValue("密码");
        cell = row.createCell(2);
        cell.setCellValue("姓名");
        cell = row.createCell(3);
        cell.setCellValue("盟市");
        cell = row.createCell(4);
        cell.setCellValue("角色名称");
        List<nmg_city_info> user = nmg_city_infoMapper.cityInfo(param);
        String[] cityArr = new String[user.size()];
        for (int i = 0; i < user.size(); i++) {
            cityArr[i] = user.get(i).getCityName();
        }
        List<Map<String,Object>> role = nmg_user_roleMapper.userRole(param,new RowBounds());
        String[] roleArr = new String[role.size()];
        for (int i = 0; i < role.size(); i++) {
            Map map = role.get(i);
            roleArr[i] = map.get("role_name").toString();
        }
        sheet.addValidationData(POIUtil.createDataValidation(sheet, cityArr, 3));
        sheet.addValidationData(POIUtil.createDataValidation(sheet, roleArr, 4));
        httpServletRequest.setCharacterEncoding("UTF-8");
        httpServletRequest.setCharacterEncoding("UTF-8");
        httpServletResponse.setContentType("application/x-download");
        fileName = new String(fileName.getBytes("gb2312"), "ISO8859-1");
        httpServletResponse.setHeader("Content-Disposition", "attachment;filename="+ fileName);
        OutputStream outputStream = httpServletResponse.getOutputStream();
        hssfWorkbook.write(outputStream);
        hssfWorkbook.close();
        cardResponse.setResDesc(fileName);
        return cardResponse;
    }
}
