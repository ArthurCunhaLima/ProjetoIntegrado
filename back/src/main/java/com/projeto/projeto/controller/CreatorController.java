package com.projeto.projeto.controller;


import com.projeto.projeto.model.Cardapio;
import com.projeto.projeto.service.CardapioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("")

public class CreatorController {
    private final CardapioService cardapioService;


    public CreatorController(CardapioService cardapioService){
        this.cardapioService = cardapioService;
    }


    @GetMapping("/home")
    public String homePage(){
        return "home/index";
    }


    @GetMapping("/cardapiocreator")
    public String cardapioCreatorPage(){
        return "cardapiocreator/index";
    }

    @GetMapping("/cardapioeditor")
    public String cardapioEditorPage(){
        return "cardapioeditor/index";
    }

    @GetMapping("/cardapio/{nomeEstabelecimento}")
    public String getNomeCardapio(
            @PathVariable String nomeEstabelecimento,
            Model model) {

        String nomeFormatado = nomeEstabelecimento.replace("-", " ");


        model.addAttribute("cardapio",
                cardapioService.obterCardapioPeloNomeUrl(nomeEstabelecimento));



        return "cardapio/index";
    }


}
