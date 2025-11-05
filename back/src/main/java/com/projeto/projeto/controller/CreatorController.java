package com.projeto.projeto.controller;


import com.projeto.projeto.model.Cardapio;
import com.projeto.projeto.model.Item;
import com.projeto.projeto.service.CardapioService;
import com.projeto.projeto.service.ItemService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/creator")
public class CreatorController {
    private final ItemService itemService;
    private final CardapioService cardapioService;

    public CreatorController(ItemService itemService, CardapioService cardapioService){
        this.itemService = itemService;
        this.cardapioService = cardapioService;
    }
    @PostMapping("/")
    public String criarCardapio(Cardapio cardapio){
        return "";
    }




}
