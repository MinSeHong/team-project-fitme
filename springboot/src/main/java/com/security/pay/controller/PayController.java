package com.security.pay.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.security.pay.dto.PayDto;
import com.security.pay.service.PayService;
import com.security.util.JWTOkens;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class PayController {

    @Autowired
    private PayService payService;

    @PostMapping("/payment/insert")
    public ResponseEntity<String> insertPayment(@RequestBody PayDto payDto, HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
            String accountNo = payload.get("sub").toString();
            payService.insertPay(accountNo, payDto);
            return ResponseEntity.ok().body("결제 성공");
        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body("결제 실패");
        }
    }
 // 구매목록 불러오기 엔드포인트
    @GetMapping("/payment/list")
    public ResponseEntity<?> getPaymentList(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization");
            Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
            System.out.println("paypayload"+payload);
            String accountNo = payload.get("sub").toString();
            System.out.println("payaccountNo"+accountNo);
            List<PayDto> paymentList = payService.getPaymentList(accountNo);
            System.out.println("paymentList123"+paymentList);
            return ResponseEntity.ok().body(paymentList);
        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body("구매목록 불러오기 실패");
        }
    }
}
