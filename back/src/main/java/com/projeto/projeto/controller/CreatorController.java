package com.projeto.projeto.controller;


import com.projeto.projeto.service.CardapioService;
import com.projeto.projeto.service.ItemService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CreatorController {
    private final ItemService itemService;
    private final CardapioService cardapioService;

    public CreatorController(ItemService itemService, CardapioService cardapioService){
        this.itemService = itemService;
        this.cardapioService = cardapioService;
    }





}
