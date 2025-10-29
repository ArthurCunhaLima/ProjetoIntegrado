package com.projeto.projeto.service;

import com.projeto.projeto.repository.CardapioRepository;
import org.springframework.stereotype.Service;


@Service
public class CardapioService {
    private final CardapioRepository cardapioRepository;

    public CardapioService(CardapioRepository cardapioRepository) {
        this.cardapioRepository = cardapioRepository;
    }


}
