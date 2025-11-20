package com.projeto.projeto.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pages")

public class CreatorController {

    @GetMapping("/home")
    public String homePage(){
        return "home/index";
    }

    @GetMapping("/cardapio")
    public String cardapioPage(){
        return "cardapio/index";
    }

    @GetMapping("/cardapiocreator")
    public String cardapioCreatorPage(){
        return "cardapiocreator/index";
    }

    @GetMapping("/cardapioeditor")
    public String cardapioEditorPage(){
        return "cardapioeditor/index";
    }



}
