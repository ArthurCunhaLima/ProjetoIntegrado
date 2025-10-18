package com.projeto.projeto.controller;


import org.springframework.web.bind.annotation.*;
import com.projeto.projeto.model.Item;
import com.projeto.projeto.service.ItemService;

import java.util.List;

@RestController
@RequestMapping("/item")
public class ItemController {
    private final ItemService itemService;


    public ItemController(ItemService itemService){
        this.itemService = itemService;
    }

    @GetMapping("/retornar")
    public List<Item> retornarItens(){
        return itemService.retornarItens();
    }

    @PostMapping("/adicionar")
    public Item adicionarItem(@RequestBody Item item){
        return itemService.adicionarItem(item.getNome(),item.getValor());
    }
}
