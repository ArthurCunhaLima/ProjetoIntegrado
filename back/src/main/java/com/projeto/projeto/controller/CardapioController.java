package com.projeto.projeto.controller;


import org.springframework.http.ResponseEntity;
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

    //Tá errado isso aqui, tá sempre retornando 200
    @GetMapping("/config/buscar/{nome}")
    public ResponseEntity<Cardapio> buscarporNome(@PathVariable String nome){
        String nomeFormatado = nome.replace("-", " ");
        return cardapioService.buscarPorNome(nomeFormatado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/config/excluir")
    public String excluirCardapio(@RequestParam String nome){
        cardapioService.excluirCardapio(nome);
        return "Cardápio excluído com sucesso";
    }

}


