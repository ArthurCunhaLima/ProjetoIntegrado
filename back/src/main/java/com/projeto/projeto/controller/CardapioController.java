package com.projeto.projeto.controller;


import com.projeto.projeto.service.CardapioService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/pedido")
public class CardapioController {
    private final CardapioService cardapioService;


    public CardapioController(CardapioService cardapioService){
        this.cardapioService = cardapioService;
    }

}
