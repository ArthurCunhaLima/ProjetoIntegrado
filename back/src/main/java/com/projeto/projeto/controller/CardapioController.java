package com.projeto.projeto.controller;


import org.springframework.ui.Model;
import com.projeto.projeto.model.Cardapio;
import com.projeto.projeto.repository.CardapioRepository;
import com.projeto.projeto.service.CardapioService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/cardapio")
public class  CardapioController {
    private final CardapioService cardapioService;


    public CardapioController(CardapioService cardapioService){
        this.cardapioService = cardapioService;
    }

    @GetMapping("/config/retornar")
    public List<Cardapio> retornarCardapio(){
        return cardapioService.retornar();
    }

    @GetMapping("/config/buscar")
    public Cardapio buscarporNome(@RequestBody String nomeEstabelecimento){
        return cardapioService.buscarPorNome(nomeEstabelecimento);
    }

    @GetMapping("retornar/nomes")
    public List<String> retornarTodosNomesEstabelecimentos(){
        return cardapioService.getAllNomesEstabelecimento();
    }
}


