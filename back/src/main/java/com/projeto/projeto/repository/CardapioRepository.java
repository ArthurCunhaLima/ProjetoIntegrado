package com.projeto.projeto.repository;

import com.projeto.projeto.model.Cardapio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardapioRepository extends JpaRepository<Cardapio, Long> {
    Cardapio findByNomeEstabelecimento(String nomeEstabelecimento);


    @Query("SELECT c.nomeEstabelecimento FROM Cardapio c")
    List<String> findAllNomesEstabelecimento();



}