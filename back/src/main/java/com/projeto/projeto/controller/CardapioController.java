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
    public Cardapio buscarporNome(@RequestParam String nome){
        return cardapioService.buscarPorNome(nome);
    }
    
    @DeleteMapping("/config/excluir")
    public String excluirCardapio(@RequestParam String nome){
        cardapioService.excluirCardapio(nome);
        return "Cardápio excluído com sucesso";
    }

}


