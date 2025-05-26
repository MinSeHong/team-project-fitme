package com.security.pay.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.security.pay.dto.PayDto;

@Mapper
public interface PayMapper {
    void insertPay(PayDto payDto);
	void insertPay(String accountNo);
	List<PayDto> getPaymentList(String accountNo);
}