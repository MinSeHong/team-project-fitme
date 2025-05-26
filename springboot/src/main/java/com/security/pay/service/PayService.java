package com.security.pay.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.security.pay.dao.PayMapper;
import com.security.pay.dto.PayDto;

@Service
public class PayService {

    @Autowired
    private PayMapper payMapper;

    public void insertPay(String accountNo, PayDto payDto) throws Exception {
        try {
            payDto.setAccountNo(accountNo);
            payMapper.insertPay(payDto);
            System.out.println("payDto: " + payDto);
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("결제 정보 삽입 중 오류 발생"); // 삽입 중 오류가 발생했음을 예외로 던짐
        }
    }

    public List<PayDto> getPaymentList(String accountNo) throws Exception {
        try {
            return payMapper.getPaymentList(accountNo);
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("구매목록 조회 중 오류 발생"); // 조회 중 오류가 발생했음을 예외로 던짐
        }
    }
}
