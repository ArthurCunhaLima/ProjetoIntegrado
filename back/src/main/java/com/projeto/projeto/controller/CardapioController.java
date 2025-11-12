package com.projeto.projeto.controller;


import com.projeto.projeto.model.Cardapio;
import com.projeto.projeto.repository.CardapioRepository;
import com.projeto.projeto.service.CardapioService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/cardapio")
public class CardapioController {
    private final CardapioService cardapioService;


    public CardapioController(CardapioService cardapioService){
        this.cardapioService = cardapioService;
    }

    @GetMapping("/retornar")
    public List<Cardapio> retornarCardapio(){
        return cardapioService.retornar();
    }

}
